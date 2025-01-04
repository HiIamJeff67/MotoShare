import * as bcrypt from "bcrypt";
import { Inject, Injectable } from '@nestjs/common';
import { BindPassengerDefaultAuthDto, BindPassengerGoogleAuthDto, ResetPassengerPasswordDto, UpdatePassengerEmailPasswordDto, ValidatePassengerInfoDto } from './dto/update-passengerAuth.dto';
import { ConfigService } from '@nestjs/config';
import { DRIZZLE } from '../drizzle/drizzle.module';
import { DrizzleDB } from '../drizzle/types/drizzle';
import { PassengerAuthTable } from '../drizzle/schema/passengerAuth.schema';
import { PassengerTable } from '../drizzle/schema/passenger.schema';
import { eq } from 'drizzle-orm';
import { ApiGenerateAuthCodeException, ApiMissingBodyOrWrongDtoException, ApiSendEmailForValidationException, ClientAuthCodeExpiredException, ClientAuthCodeNotPairException, ClientInvalidGoogleIdTokenException, ClientNoChangeOnEmailException, ClientNoChangeOnPasswordException, ClientOldPasswordNotMatchException, ClientPassengerNotFoundException, ClientUserDefaultAuthAlreadyBoundException, ClientUserGoogleAuthAlreadyBoundException, ClientWithoutDefaultAuthenticatedException, ServerExtractGoogleAuthUrlEnvVariableException } from '../exceptions';
import { EmailService } from '../email/email.service';
import { TEMP_ACCESS_TOKEN } from "../constants/auth.constant";
import { isTempEmail } from "../utils";
import { PassengerInfoTable } from "../drizzle/schema/passengerInfo.schema";

@Injectable()
export class PassengerAuthService {
	constructor(
		private config: ConfigService, 
		private email: EmailService, 
		@Inject(DRIZZLE) private db: DrizzleDB, 
	) {}

	/* ================================= AuthCode Generator & Sender ================================= */
	private _generateAuthCode(): string {
		let randomAuthCode = Math.floor(Math.random() * Math.pow(10, Number(this.config.get("AUTH_CODE_LENGTH")))).toString()
		while (randomAuthCode.length < 6) randomAuthCode = "0" + randomAuthCode;
		return randomAuthCode;
	}

	async sendAuthenticationCodeById(
		id: string, 
		title: string
	) {
		return await this.db.transaction(async (tx) => {
			const responseOfSelectingPassenger = await tx.select({
				userName: PassengerTable.userName, 
				email: PassengerTable.email, 
			}).from(PassengerTable)
			  .where(eq(PassengerTable.id, id))
			  .limit(1);
			if (!responseOfSelectingPassenger || responseOfSelectingPassenger.length === 0) {
				throw ClientPassengerNotFoundException;
			}

			const responseOfUpdatingAuthCode = await tx.update(PassengerAuthTable).set({
				authCode: this._generateAuthCode(), 
				authCodeExpiredAt: new Date((new Date()).getTime() + Number(this.config.get("AUTH_CODE_EXPIRED_IN")) * 60000), 	
			}).where(eq(PassengerAuthTable.userId, id))
			  .returning({
				authCode: PassengerAuthTable.authCode, 
				authCodeExpiredAt: PassengerAuthTable.authCodeExpiredAt, 
			  });
			if (!responseOfUpdatingAuthCode || responseOfUpdatingAuthCode.length === 0) {
				throw ApiGenerateAuthCodeException;
			}

			const responseOfSendingEamil = await this.email.sendValidationEamil(
				responseOfSelectingPassenger[0].email, 
				{
					title: title, 
					userName: responseOfSelectingPassenger[0].userName, 
					validationCode: responseOfUpdatingAuthCode[0].authCode, 
					// if the authCode come from response of updaing auth code fail, then we will be stopped at the top
				}
			)
			if (!responseOfSendingEamil || responseOfSendingEamil.length === 0) {
				throw ApiSendEmailForValidationException;
			}

			return [{
				email: responseOfSelectingPassenger[0].email, 
				authCodeExpiredAt: responseOfUpdatingAuthCode[0].authCodeExpiredAt, 
			}];
		});
	}

	async sendAuthenticationCodeByEmail(
		email: string, 
		title: string
	) {
		return await this.db.transaction(async (tx) => {
			const responseOfSelectingPassenger = await tx.select({
				id: PassengerTable.id, 
				userName: PassengerTable.userName, 
				email: PassengerTable.email, 
			}).from(PassengerTable)
			  .where(eq(PassengerTable.email, email))
			  .limit(1);
			if (!responseOfSelectingPassenger || responseOfSelectingPassenger.length === 0) {
				throw ClientPassengerNotFoundException;
			}

			const responseOfUpdatingAuthCode = await tx.update(PassengerAuthTable).set({
				authCode: this._generateAuthCode(), 
				authCodeExpiredAt: new Date((new Date()).getTime() + Number(this.config.get("AUTH_CODE_EXPIRED_IN")) * 60000), 
			}).where(eq(PassengerAuthTable.userId, responseOfSelectingPassenger[0].id))
			  .returning({
				authCode: PassengerAuthTable.authCode, 
				authCodeExpiredAt: PassengerAuthTable.authCodeExpiredAt, 
			  });
			if (!responseOfUpdatingAuthCode || responseOfUpdatingAuthCode.length === 0) {
				throw ApiGenerateAuthCodeException;
			}

			const responseOfSendingEmail = await this.email.sendValidationEamil(
				responseOfSelectingPassenger[0].email, 
				{
					title: title, 
					userName: responseOfSelectingPassenger[0].userName, 
					validationCode: responseOfUpdatingAuthCode[0].authCode, 
				}
			)
			if (!responseOfSendingEmail || responseOfSendingEmail.length === 0) {
				throw ApiSendEmailForValidationException;
			}

			return [{
				email: responseOfSelectingPassenger[0].email, 
				authCodeExpiredAt: responseOfUpdatingAuthCode[0].authCodeExpiredAt, 
			}];
		});
	}
	/* ================================= AuthCode Generator & Sender ================================= */


	/* ================================= Get Operations ================================= */
	async getPassengerAuthByUserId(
		userId: string, 
	) {
		const responseOfSelectingPassengerAuth = await this.db.select({
			isEmailAuthenticated: PassengerAuthTable.isEmailAuthenticated, 
			isPhoneAuthenticated: PassengerAuthTable.isPhoneAuthenticated, 
			isDefaultAuthenticated: PassengerAuthTable.isDefaultAuthenticated, 
			googleId: PassengerAuthTable.googleId, 
		}).from(PassengerAuthTable)
		  .where(eq(PassengerAuthTable.userId, userId));
		
		return [{
			isEmailAuthenticated: responseOfSelectingPassengerAuth[0].isEmailAuthenticated, 
			isPhoneAuthenticated: responseOfSelectingPassengerAuth[0].isPhoneAuthenticated, 
			isDefaultAuthenticated: responseOfSelectingPassengerAuth[0].isDefaultAuthenticated, 
			isGoogleAuthenticated: (responseOfSelectingPassengerAuth[0].googleId && responseOfSelectingPassengerAuth[0].googleId.length !== 0 ? true : false), 
		}];
	}
	/* ================================= Get Operations ================================= */

	
	/* ================================= Email validation ================================= */
	async validateAuthCodeForEmail(
		id: string, 
		validatePassengerInfoDto: ValidatePassengerInfoDto
	) {
		return await this.db.transaction(async (tx) => {
			const responseOfSelectingPassengerAuth = await tx.select({
				authCode: PassengerAuthTable.authCode, 
				authCodeExpiredAt: PassengerAuthTable.authCodeExpiredAt, 
			}).from(PassengerAuthTable)
			  .where(eq(PassengerAuthTable.userId, id))
			  .limit(1);
			if (!responseOfSelectingPassengerAuth || responseOfSelectingPassengerAuth.length === 0) {
				throw ClientPassengerNotFoundException;
			}

			if (responseOfSelectingPassengerAuth[0].authCode !== validatePassengerInfoDto.authCode) {
				throw ClientAuthCodeNotPairException;
			}
			if (responseOfSelectingPassengerAuth[0].authCodeExpiredAt <= new Date()) {
				throw ClientAuthCodeExpiredException;
			}

			return await tx.update(PassengerAuthTable).set({
				isEmailAuthenticated: true, 
				authCode: "USED", 
				authCodeExpiredAt: new Date(), 
			}).where(eq(PassengerAuthTable.userId, id))
			  .returning({
				isEmailAuthenticated: PassengerAuthTable.isEmailAuthenticated, 
			});
		});
	}
	/* ================================= Email validation ================================= */


	/* ================================= Forget & Reset Password validation ================================= */
	async validateAuthCodeToResetForgottenPassword(
		resetPassengerPasswordDto: ResetPassengerPasswordDto, 
	) {
		return await this.db.transaction(async (tx) => {
			const responseOfSelectingPassenger = await tx.select({
				id: PassengerTable.id,
				hash: PassengerTable.password,
			  }).from(PassengerTable)
				.where(eq(PassengerTable.email, resetPassengerPasswordDto.email))
				.limit(1);
			if (!responseOfSelectingPassenger || responseOfSelectingPassenger.length === 0) {
				throw ClientPassengerNotFoundException;
			}

			const responseOfSelectingPassengerAuth = await tx.select({
				authCode: PassengerAuthTable.authCode, 
				authCodeExpiredAt: PassengerAuthTable.authCodeExpiredAt, 
				isDefaultAuthenticated: PassengerAuthTable.isDefaultAuthenticated, 
			}).from(PassengerAuthTable)
			  .where(eq(PassengerAuthTable.userId, responseOfSelectingPassenger[0].id))
			  .limit(1);
			if (!responseOfSelectingPassengerAuth || responseOfSelectingPassengerAuth.length === 0) {
				throw ClientPassengerNotFoundException;
			}

			if (!responseOfSelectingPassengerAuth[0].isDefaultAuthenticated) {
				throw ClientWithoutDefaultAuthenticatedException;
			}
			if (responseOfSelectingPassengerAuth[0].authCode !== resetPassengerPasswordDto.authCode) {
				throw ClientAuthCodeNotPairException;
			}
			if (responseOfSelectingPassengerAuth[0].authCodeExpiredAt <= new Date()) {
				throw ClientAuthCodeExpiredException;
			}

			// check using the previous password as new password
			const pwMatches = await bcrypt.compare(resetPassengerPasswordDto.password, responseOfSelectingPassenger[0].hash);
			if (pwMatches) throw ClientNoChangeOnPasswordException;

			// set authCode to expired status after being used
			await tx.update(PassengerAuthTable).set({
				authCode: "USED", 
				authCodeExpiredAt: new Date(), 
			}).where(eq(PassengerAuthTable.userId, responseOfSelectingPassenger[0].id));

			// reset logic
			const hash = await bcrypt.hash(resetPassengerPasswordDto.password, Number(this.config.get("SALT_OR_ROUND")));
			return await tx.update(PassengerTable).set({
				password: hash, 
				accessToken: TEMP_ACCESS_TOKEN, 
			}).where(eq(PassengerTable.id, responseOfSelectingPassenger[0].id))
				.returning({
				userName: PassengerTable.userName, 
				email: PassengerTable.email, 
			});
		});
	}

	async validateAuthCodeToResetEmailOrPassword(
		id: string, 
		updatePassengerEmailPasswordDto: UpdatePassengerEmailPasswordDto, 
	) {
		return await this.db.transaction(async (tx) => {
			const responseOfSelectingPassengerAuth = await tx.select({
				authCode: PassengerAuthTable.authCode, 
				authCodeExpiredAt: PassengerAuthTable.authCodeExpiredAt, 
				isDefaultAuthenticated: PassengerAuthTable.isDefaultAuthenticated, 
			}).from(PassengerAuthTable)
			  .where(eq(PassengerAuthTable.userId, id))
			  .limit(1);
			if (!responseOfSelectingPassengerAuth || responseOfSelectingPassengerAuth.length === 0) {
				throw ClientPassengerNotFoundException;
			}

			if (!responseOfSelectingPassengerAuth[0].isDefaultAuthenticated) {
				throw ClientWithoutDefaultAuthenticatedException;
			}
			if (responseOfSelectingPassengerAuth[0].authCode !== updatePassengerEmailPasswordDto.authCode) {
				throw ClientAuthCodeNotPairException;
			}
			if (responseOfSelectingPassengerAuth[0].authCodeExpiredAt <= new Date()) {
				throw ClientAuthCodeExpiredException;
			}

			// make sure the authCode is expired after being used
			await tx.update(PassengerAuthTable).set({
				authCode: "USED", 
				authCodeExpiredAt: new Date(), 
			}).where(eq(PassengerAuthTable.userId, id));

			// reset logic
			const responseOfSelectingPassenger = await tx.select({
				id: PassengerTable.id,
				email: PassengerTable.email, 
				hash: PassengerTable.password,
			  }).from(PassengerTable)
				.where(eq(PassengerTable.id, id))
				.limit(1);
			if (!responseOfSelectingPassenger || responseOfSelectingPassenger.length === 0) {
				throw ClientPassengerNotFoundException;
			}

			let flag = false;
			if (updatePassengerEmailPasswordDto.email && updatePassengerEmailPasswordDto.email.length !== 0) {
				flag = true;
				const emMatches = updatePassengerEmailPasswordDto.email === responseOfSelectingPassenger[0].email;
				if (emMatches) throw ClientNoChangeOnEmailException;
			}
			if (updatePassengerEmailPasswordDto.oldPassword && updatePassengerEmailPasswordDto.oldPassword.length !== 0
				&& updatePassengerEmailPasswordDto.newPassword && updatePassengerEmailPasswordDto.newPassword.length !== 0
				&& updatePassengerEmailPasswordDto.oldPassword !== updatePassengerEmailPasswordDto.newPassword) {
					const oldPwMatches = await bcrypt.compare(updatePassengerEmailPasswordDto.oldPassword, responseOfSelectingPassenger[0].hash);
					if (!oldPwMatches) throw ClientOldPasswordNotMatchException;

					const newPwMatches = await bcrypt.compare(updatePassengerEmailPasswordDto.newPassword, responseOfSelectingPassenger[0].hash);
					if (newPwMatches) throw ClientNoChangeOnPasswordException;

					const hash = await bcrypt.hash(updatePassengerEmailPasswordDto.newPassword, Number(this.config.get("SALT_OR_ROUND")));
					return await tx.update(PassengerTable).set({
						...(flag ? {email: updatePassengerEmailPasswordDto.email, } : {}),
						password: hash, 
						accessToken: TEMP_ACCESS_TOKEN, 
					}).where(eq(PassengerTable.id, id))
					.returning({
						userName: PassengerTable.userName, 
						email: PassengerTable.email, 
					});
			}
			
			if (!flag) throw ApiMissingBodyOrWrongDtoException;

			return await tx.update(PassengerTable).set({
				email: updatePassengerEmailPasswordDto.email, 
			}).where(eq(PassengerTable.id, id))
			.returning({
				userName: PassengerTable.userName, 
				email: PassengerTable.email, 
			});
		});
	}
	/* ================================= Forget & Reset Password validation ================================= */

	/* ================================= Binding Operations ================================= */
	async bindDefaultAuth(
		id: string, 
		bindPassengerDefaultAuthDto: BindPassengerDefaultAuthDto, 
	) {
		return await this.db.transaction(async (tx) => {
			const responseOfSelectingPassengerAuth = await tx.select({
				isDefaultAuthenticated: PassengerAuthTable.isDefaultAuthenticated, 
			}).from(PassengerAuthTable)
			  .where(eq(PassengerAuthTable.userId, id))
			  .limit(1);
			if (!responseOfSelectingPassengerAuth || responseOfSelectingPassengerAuth.length === 0) {
				throw ClientPassengerNotFoundException;
			}

			if (responseOfSelectingPassengerAuth[0].isDefaultAuthenticated) {
				throw ClientUserDefaultAuthAlreadyBoundException;
			}

			const responseOfUpdatingPassengerAuth = await tx.update(PassengerAuthTable).set({
				isDefaultAuthenticated: true, 
			}).where(eq(PassengerTable.id, id))
			  .returning();
			if (!responseOfUpdatingPassengerAuth || responseOfSelectingPassengerAuth.length === 0) {
				throw ClientPassengerNotFoundException;
			}

			const hash = await bcrypt.hash(bindPassengerDefaultAuthDto.password, Number(this.config.get("SALT_OR_ROUND")));
			return await tx.update(PassengerTable).set({
				email: bindPassengerDefaultAuthDto.email, 
				password: hash, 
				accessToken: TEMP_ACCESS_TOKEN, 
			}).where(eq(PassengerTable.id, id))
			  .returning({
				userName: PassengerTable.userName, 
				email: PassengerTable.email, 
			});
		});
	}

	async bindGoogleAuth(
		id: string, 
		bindPassengerGoogleAuthDto: BindPassengerGoogleAuthDto, 
	) {
		return await this.db.transaction(async (tx) => {
			const responseOfSelectingPassengerAuth = await tx.select({
				googleId: PassengerAuthTable.googleId, 
			}).from(PassengerAuthTable)
			  .where(eq(PassengerAuthTable.userId, id))
			  .limit(1);
			if (!responseOfSelectingPassengerAuth || responseOfSelectingPassengerAuth.length === 0) {
				throw ClientPassengerNotFoundException;
			}

			if (responseOfSelectingPassengerAuth[0].googleId || responseOfSelectingPassengerAuth[0].googleId !== null
				|| responseOfSelectingPassengerAuth[0].googleId !== "") {
					throw ClientUserGoogleAuthAlreadyBoundException;
			}

			const googleAuthUrl = this.config.get("GOOGLE_AUTH_URL");
			if (!googleAuthUrl) throw ServerExtractGoogleAuthUrlEnvVariableException;

			const parseDataFromGoogleTokenResponse = await fetch(googleAuthUrl + bindPassengerGoogleAuthDto.idToken);
            if (!parseDataFromGoogleTokenResponse.ok) {
                throw ClientInvalidGoogleIdTokenException;
            }
            const parseDataFromGoogleToken = await parseDataFromGoogleTokenResponse.json();

			const responseOfUpdatingPassengerAuth = await tx.update(PassengerAuthTable).set({
				googleId: parseDataFromGoogleToken["sub"], 
			}).where(eq(PassengerTable.id, id))
			  .returning();
			if (!responseOfUpdatingPassengerAuth || responseOfSelectingPassengerAuth.length === 0) {
				throw ClientPassengerNotFoundException;
			}

			const responseOfSelectingPassenger = await tx.select({
				userName: PassengerTable.userName, 
				email: PassengerTable.email, 
				avatorUrl: PassengerInfoTable.avatorUrl, 
			}).from(PassengerTable)
		      .where(eq(PassengerTable.id, id))
			  .leftJoin(PassengerInfoTable, eq(PassengerInfoTable.userId, PassengerTable.id))
			  .limit(1);
			if (!responseOfSelectingPassenger || responseOfSelectingPassenger.length === 0) {
				throw ClientPassengerNotFoundException;
			}

			let responseOfUpdatingAvatorUrl: any = null, responseOfUpdatingEmail: any = null;
			if (responseOfSelectingPassenger[0].avatorUrl === null) {
				responseOfUpdatingAvatorUrl = await tx.update(PassengerInfoTable).set({
					avatorUrl: parseDataFromGoogleToken["picture"], 
				}).where(eq(PassengerInfoTable.userId, id))
				  .returning({
					avatorUrl: PassengerInfoTable.avatorUrl, 
				  });
				if (!responseOfUpdatingAvatorUrl || responseOfUpdatingAvatorUrl.length === 0) {
					throw ClientPassengerNotFoundException;
				}
			}
			if (isTempEmail(responseOfSelectingPassenger[0].email)) {
				responseOfUpdatingEmail = await tx.update(PassengerTable).set({
					email: parseDataFromGoogleToken["email"], 
				}).where(eq(PassengerTable.id, id))
				  .returning({
					userName: PassengerTable.userName, 
					email: PassengerTable.email, 
				});
				if (!responseOfUpdatingEmail || responseOfUpdatingEmail.length === 0) {
					throw ClientPassengerNotFoundException;
				}
			}

			return [{
				...responseOfSelectingPassenger[0], 
				...(responseOfUpdatingAvatorUrl === null ? {} : responseOfUpdatingAvatorUrl[0]), 
				...(responseOfUpdatingEmail === null ? {} : responseOfUpdatingEmail[0]), 
			}];
		});
	}
    /* ================================= Binding Operations ================================= */
}

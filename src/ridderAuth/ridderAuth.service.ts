import * as bcrypt from "bcrypt";
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EmailService } from '../email/email.service';
import { DrizzleDB } from '../drizzle/types/drizzle';
import { DRIZZLE } from '../drizzle/drizzle.module';
import { RidderTable } from '../drizzle/schema/ridder.schema';
import { ApiGenerateAuthCodeException, ApiMissingBodyOrWrongDtoException, ApiSendEmailForValidationException, ClientAuthCodeExpiredException, ClientAuthCodeNotPairException, ClientInvalidGoogleIdTokenException, ClientNoChangeOnEmailException, ClientNoChangeOnPasswordException, ClientOldPasswordNotMatchException, ClientRidderNotFoundException, ClientUserDefaultAuthAlreadyBoundException, ClientUserGoogleAuthAlreadyBoundException, ServerExtractGoogleAuthUrlEnvVariableException } from '../exceptions';
import { RidderAuthTable } from '../drizzle/schema/ridderAuth.schema';
import { eq } from 'drizzle-orm';
import { BindRidderDefaultAuthDto, BindRidderGoogleAuthDto, ResetRidderPasswordDto, UpdateRidderEmailPasswordDto, ValidateRidderInfoDto } from './dto/update-ridderAuth.dto';
import { TEMP_ACCESS_TOKEN } from "../constants/auth.constant";
import { isTempEmail } from "../utils";

@Injectable()
export class RidderAuthService {
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
	
	async sendAuthenticationCodeById(id: string, title: string) {
		return await this.db.transaction(async (tx) => {
			const responseOfSelectingRidder = await tx.select({
				userName: RidderTable.userName, 
				email: RidderTable.email, 
			}).from(RidderTable)
			  .where(eq(RidderTable.id, id))
			  .limit(1);
			if (!responseOfSelectingRidder || responseOfSelectingRidder.length === 0) {
				throw ClientRidderNotFoundException;
			}

			const responseOfUpdatingAuthCode = await tx.update(RidderAuthTable).set({
				authCode: this._generateAuthCode(), 
				authCodeExpiredAt: new Date((new Date()).getTime() + Number(this.config.get("AUTH_CODE_EXPIRED_IN")) * 60000), 	
			}).where(eq(RidderAuthTable.userId, id))
			  .returning({
				authCode: RidderAuthTable.authCode, 
				authCodeExpiredAt: RidderAuthTable.authCodeExpiredAt, 
			  });
			if (!responseOfUpdatingAuthCode || responseOfUpdatingAuthCode.length === 0) {
				throw ApiGenerateAuthCodeException;
			}

			const responseOfSendingEamil = await this.email.sendValidationEamil(
				responseOfSelectingRidder[0].email, 
				{
					title: title, 
					userName: responseOfSelectingRidder[0].userName, 
					validationCode: responseOfUpdatingAuthCode[0].authCode, 
					// if the authCode come from response of updaing auth code fail, then we will be stopped at the top
				}
			)
			if (!responseOfSendingEamil || responseOfSendingEamil.length === 0) {
				throw ApiSendEmailForValidationException;
			}

			return [{
				email: responseOfSelectingRidder[0].email, 
				authCodeExpiredAt: responseOfUpdatingAuthCode[0].authCodeExpiredAt, 
			}];
		});
	}

	async sendAuthenticationCodeByEmail(
		email: string, 
		title: string
	) {
		return await this.db.transaction(async (tx) => {
			const responseOfSelectingRidder = await tx.select({
				id: RidderTable.id, 
				userName: RidderTable.userName, 
				email: RidderTable.email, 
			}).from(RidderTable)
			  .where(eq(RidderTable.email, email))
			  .limit(1);
			if (!responseOfSelectingRidder || responseOfSelectingRidder.length === 0) {
				throw ClientRidderNotFoundException;
			}

			const responseOfUpdatingAuthCode = await tx.update(RidderAuthTable).set({
				authCode: this._generateAuthCode(), 
				authCodeExpiredAt: new Date((new Date()).getTime() + Number(this.config.get("AUTH_CODE_EXPIRED_IN")) * 60000), 	
			}).where(eq(RidderAuthTable.userId, responseOfSelectingRidder[0].id))
			  .returning({
				authCode: RidderAuthTable.authCode, 
				authCodeExpiredAt: RidderAuthTable.authCodeExpiredAt, 
			  });
			if (!responseOfUpdatingAuthCode || responseOfUpdatingAuthCode.length === 0) {
				throw ApiGenerateAuthCodeException;
			}

			const responseOfSendingEamil = await this.email.sendValidationEamil(
				responseOfSelectingRidder[0].email, 
				{
					title: title, 
					userName: responseOfSelectingRidder[0].userName, 
					validationCode: responseOfUpdatingAuthCode[0].authCode, 
				}
			)
			if (!responseOfSendingEamil || responseOfSendingEamil.length === 0) {
				throw ApiSendEmailForValidationException;
			}

			return [{
				email: responseOfSelectingRidder[0].email, 
				authCodeExpiredAt: responseOfUpdatingAuthCode[0].authCodeExpiredAt, 
			}];
		});
	}
	/* ================================= AuthCode Generator & Sender ================================= */

	
	/* ================================= Get Operations ================================= */
	async getRidderAuthByUserId(
		userId: string, 
	) {
		const responseOfSelectingRidderAuth = await this.db.select({
			isEmailAuthenticated: RidderAuthTable.isEmailAuthenticated, 
			isPhoneAuthenticated: RidderAuthTable.isPhoneAuthenticated, 
			isDefaultAuthenticated: RidderAuthTable.isDefaultAuthenticated, 
			googleId: RidderAuthTable.googleId, 
		}).from(RidderAuthTable)
		  .where(eq(RidderAuthTable.userId, userId));

		return [{
			isEmailAuthenticated: responseOfSelectingRidderAuth[0].isEmailAuthenticated, 
			isPhoneAuthenticated: responseOfSelectingRidderAuth[0].isPhoneAuthenticated, 
			isDefaultAuthenticated: responseOfSelectingRidderAuth[0].isDefaultAuthenticated, 
			isGoogleAuthenticated: (responseOfSelectingRidderAuth[0].googleId && responseOfSelectingRidderAuth[0].googleId.length === 0 ? true : false), 
		}]
	}
	/* ================================= Get Operations ================================= */


	/* ================================= Email validation ================================= */
	async validateAuthCodeForEmail(id: string, validateRidderInfoDto: ValidateRidderInfoDto) {
		return await this.db.transaction(async (tx) => {
			const responseOfSelectingRidderAuth = await tx.select({
				authCode: RidderAuthTable.authCode, 
				authCodeExpiredAt: RidderAuthTable.authCodeExpiredAt, 
			}).from(RidderAuthTable)
			  .where(eq(RidderAuthTable.userId, id))
			  .limit(1);
			if (!responseOfSelectingRidderAuth || responseOfSelectingRidderAuth.length === 0) {
				throw ClientRidderNotFoundException;
			}

			if (responseOfSelectingRidderAuth[0].authCode !== validateRidderInfoDto.authCode) {
				throw ClientAuthCodeNotPairException;
			}
			if (responseOfSelectingRidderAuth[0].authCodeExpiredAt <= new Date()) {
				throw ClientAuthCodeExpiredException;
			}

			return await tx.update(RidderAuthTable).set({
				isEmailAuthenticated: true, 
				authCode: "USED", 
				authCodeExpiredAt: new Date(), 
			}).where(eq(RidderAuthTable.userId, id))
			  .returning({
				isEmailAuthenticated: RidderAuthTable.isEmailAuthenticated, 
			});
		});
	}
	/* ================================= Email validation ================================= */


	/* ================================= Forget & Reset Password validation ================================= */
	async validateAuthCodeToResetForgottenPassword(
		resetRidderPasswordDto: ResetRidderPasswordDto, 
	) {
		return await this.db.transaction(async (tx) => {
			const responseOfSelectingRidder = await tx.select({
				id: RidderTable.id,
				hash: RidderTable.password,
			  }).from(RidderTable)
				.where(eq(RidderTable.email, resetRidderPasswordDto.email))
				.limit(1);
			if (!responseOfSelectingRidder || responseOfSelectingRidder.length === 0) {
				throw ClientRidderNotFoundException;
			}

			const responseOfSelectingRidderAuth = await tx.select({
				authCode: RidderAuthTable.authCode, 
				authCodeExpiredAt: RidderAuthTable.authCodeExpiredAt, 
			}).from(RidderAuthTable)
			  .where(eq(RidderAuthTable.userId, responseOfSelectingRidder[0].id))
			  .limit(1);
			if (!responseOfSelectingRidderAuth || responseOfSelectingRidderAuth.length === 0) {
				throw ClientRidderNotFoundException;
			}
			if (responseOfSelectingRidderAuth[0].authCode !== resetRidderPasswordDto.authCode) {
				throw ClientAuthCodeNotPairException;
			}
			if (responseOfSelectingRidderAuth[0].authCodeExpiredAt <= new Date()) {
				throw ClientAuthCodeExpiredException;
			}

			// make sure the authCode is expired after being used
			await tx.update(RidderAuthTable).set({
				authCode: "USED", 
				authCodeExpiredAt: new Date(), 
			}).where(eq(RidderAuthTable.userId, responseOfSelectingRidder[0].id));

			// check using the previous password as new password
			const pwMatches = await bcrypt.compare(resetRidderPasswordDto.password, responseOfSelectingRidder[0].hash);
			if (pwMatches) throw ClientNoChangeOnPasswordException;

			const hash = await bcrypt.hash(resetRidderPasswordDto.password, Number(this.config.get("SALT_OR_ROUND")));
			return await tx.update(RidderTable).set({
				password: hash, 
				accessToken: TEMP_ACCESS_TOKEN, 
			}).where(eq(RidderTable.id, responseOfSelectingRidder[0].id))
				.returning({
				userName: RidderTable.userName, 
				email: RidderTable.email, 
			});
		});
	}

	async validateAuthCodeToResetEmailOrPassword(
		id: string, 
		updateRidderEmailPasswordDto: UpdateRidderEmailPasswordDto, 
	) {
		return await this.db.transaction(async (tx) => {
			const responseOfSelectingRidderAuth = await tx.select({
				authCode: RidderAuthTable.authCode, 
				authCodeExpiredAt: RidderAuthTable.authCodeExpiredAt, 
			}).from(RidderAuthTable)
			  .where(eq(RidderAuthTable.userId, id))
			  .limit(1);
			if (!responseOfSelectingRidderAuth || responseOfSelectingRidderAuth.length === 0) {
				throw ClientRidderNotFoundException;
			}

			if (responseOfSelectingRidderAuth[0].authCode !== updateRidderEmailPasswordDto.authCode) {
				throw ClientAuthCodeNotPairException;
			}
			if (responseOfSelectingRidderAuth[0].authCodeExpiredAt <= new Date()) {
				throw ClientAuthCodeExpiredException;
			}

			// make sure the authCode is expired after being used
			await tx.update(RidderAuthTable).set({
				authCode: "USED", 
				authCodeExpiredAt: new Date(), 
			}).where(eq(RidderAuthTable.userId, id));

			// reset logic
			const responseOfSelectingRidder = await tx.select({
				id: RidderTable.id,
				email: RidderTable.email, 
				hash: RidderTable.password,
			  }).from(RidderTable)
				.where(eq(RidderTable.id, id))
				.limit(1);
			if (!responseOfSelectingRidder || responseOfSelectingRidder.length === 0) {
				throw ClientRidderNotFoundException;
			}

			let flag = false;
			if (updateRidderEmailPasswordDto.email && updateRidderEmailPasswordDto.email.length !== 0) {
				flag = true;
				const emMatches = updateRidderEmailPasswordDto.email === responseOfSelectingRidder[0].email;
				if (emMatches) throw ClientNoChangeOnEmailException;
			}
			if (updateRidderEmailPasswordDto.oldPassword && updateRidderEmailPasswordDto.oldPassword.length !== 0
				&& updateRidderEmailPasswordDto.newPassword && updateRidderEmailPasswordDto.newPassword.length !== 0
				&& updateRidderEmailPasswordDto.oldPassword !== updateRidderEmailPasswordDto.newPassword) {
					const oldPwMatches = await bcrypt.compare(updateRidderEmailPasswordDto.oldPassword, responseOfSelectingRidder[0].hash);
					if (!oldPwMatches) throw ClientOldPasswordNotMatchException;

					const newPwMatches = await bcrypt.compare(updateRidderEmailPasswordDto.newPassword, responseOfSelectingRidder[0].hash);
					if (newPwMatches) throw ClientNoChangeOnPasswordException;

					const hash = await bcrypt.hash(updateRidderEmailPasswordDto.newPassword, Number(this.config.get("SALT_OR_ROUND")));
					return await tx.update(RidderTable).set({
						...(flag ? {email: updateRidderEmailPasswordDto.email, } : {}),
						password: hash, 
						accessToken: TEMP_ACCESS_TOKEN, 
					}).where(eq(RidderTable.id, id))
					.returning({
						userName: RidderTable.userName, 
						email: RidderTable.email, 
					});
			}
			
			if (!flag) throw ApiMissingBodyOrWrongDtoException;

			return await tx.update(RidderTable).set({
				email: updateRidderEmailPasswordDto.email, 
			}).where(eq(RidderTable.id, id))
			.returning({
				userName: RidderTable.userName, 
				email: RidderTable.email, 
			});
		});
	}
	/* ================================= Forget & Reset Password validation ================================= */


	/* ================================= Binding Operations ================================= */
	async bindDefaultAuth(
		id: string, 
		bindRidderDefaultAuthDto: BindRidderDefaultAuthDto, 
	) {
		return await this.db.transaction(async (tx) => {
			const responseOfSelectingRidderAuth = await tx.select({
				isDefaultAuthenticated: RidderAuthTable.isDefaultAuthenticated, 
			}).from(RidderAuthTable)
				.where(eq(RidderAuthTable.userId, id))
				.limit(1);
			if (!responseOfSelectingRidderAuth || responseOfSelectingRidderAuth.length === 0) {
				throw ClientRidderNotFoundException;
			}

			if (responseOfSelectingRidderAuth[0].isDefaultAuthenticated) {
				throw ClientUserDefaultAuthAlreadyBoundException;
			}

			const responseOfUpdatingRidderAuth = await tx.update(RidderAuthTable).set({
				isDefaultAuthenticated: true, 
			}).where(eq(RidderTable.id, id))
				.returning();
			if (!responseOfUpdatingRidderAuth || responseOfSelectingRidderAuth.length === 0) {
				throw ClientRidderNotFoundException;
			}

			const hash = await bcrypt.hash(bindRidderDefaultAuthDto.password, Number(this.config.get("SALT_OR_ROUND")));
			return await tx.update(RidderTable).set({
				email: bindRidderDefaultAuthDto.email, 
				password: hash, 
				accessToken: TEMP_ACCESS_TOKEN, 
			}).where(eq(RidderTable.id, id))
				.returning({
				userName: RidderTable.userName, 
				email: RidderTable.email, 
			});
		});
	}

	async bindGoogleAuth(
		id: string, 
		bindRidderGoogleAuthDto: BindRidderGoogleAuthDto, 
	) {
		return await this.db.transaction(async (tx) => {
			const responseOfSelectingRidderAuth = await tx.select({
				googleId: RidderAuthTable.googleId, 
			}).from(RidderAuthTable)
				.where(eq(RidderAuthTable.userId, id))
				.limit(1);
			if (!responseOfSelectingRidderAuth || responseOfSelectingRidderAuth.length === 0) {
				throw ClientRidderNotFoundException;
			}

			if (responseOfSelectingRidderAuth[0].googleId || responseOfSelectingRidderAuth[0].googleId !== null
				|| responseOfSelectingRidderAuth[0].googleId !== "") {
					throw ClientUserGoogleAuthAlreadyBoundException;
			}

			const googleAuthUrl = this.config.get("GOOGLE_AUTH_URL");
			if (!googleAuthUrl) throw ServerExtractGoogleAuthUrlEnvVariableException;

			const parseDataFromGoogleTokenResponse = await fetch(googleAuthUrl + bindRidderGoogleAuthDto.idToken);
            if (!parseDataFromGoogleTokenResponse.ok) {
                throw ClientInvalidGoogleIdTokenException;
            }
            const parseDataFromGoogleToken = await parseDataFromGoogleTokenResponse.json();

			const responseOfUpdatingRidderAuth = await tx.update(RidderAuthTable).set({
				googleId: parseDataFromGoogleToken["sub"], 
			}).where(eq(RidderTable.id, id))
				.returning();
			if (!responseOfUpdatingRidderAuth || responseOfSelectingRidderAuth.length === 0) {
				throw ClientRidderNotFoundException;
			}

			const responseOfSelectingRidder = await tx.select({
				userName: RidderTable.userName, 
				email: RidderTable.email, 
			}).from(RidderTable)
				.where(eq(RidderTable.id, id))
				.limit(1);
			if (!responseOfSelectingRidder || responseOfSelectingRidder.length === 0) {
				throw ClientRidderNotFoundException;
			}

			if (isTempEmail(responseOfSelectingRidder[0].email)) {
				return await tx.update(RidderTable).set({
					email: parseDataFromGoogleToken["email"], 
				}).where(eq(RidderTable.id, id))
					.returning({
					userName: RidderTable.userName, 
					email: RidderTable.email, 
				});
			}

			return responseOfSelectingRidder;
		});
	}
	/* ================================= Binding Operations ================================= */
}

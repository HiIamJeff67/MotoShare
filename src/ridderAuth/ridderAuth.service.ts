import * as bcrypt from "bcrypt";
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EmailService } from '../email/email.service';
import { DrizzleDB } from '../drizzle/types/drizzle';
import { DRIZZLE } from '../drizzle/drizzle.module';
import { RidderTable } from '../drizzle/schema/ridder.schema';
import { ApiGenerateAuthCodeException, ApiMissingBodyOrWrongDtoException, ApiSendEmailForValidationException, ClientAuthCodeExpiredException, ClientAuthCodeNotPairException, ClientNoChangeOnEmailException, ClientNoChangeOnPasswordException, ClientOldPasswordNotMatchException, ClientRidderNotFoundException } from '../exceptions';
import { RidderAuthTable } from '../drizzle/schema/ridderAuth.schema';
import { eq } from 'drizzle-orm';
import { ResetRidderPasswordDto, UpdateRidderEmailPasswordDto, ValidateRidderInfoDto } from './dto/update-ridderAuth.dto';

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
	/* ================================= AuthCode Generator & Sender ================================= */

	
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
			}).where(eq(RidderAuthTable.userId, id))
			  .returning({
				isEmailAuthenticated: RidderAuthTable.isEmailAuthenticated, 
			});
		});
	}
	/* ================================= Email validation ================================= */


	/* ================================= Forget & Reset Password validation ================================= */
	async validateAuthCodeToResetForgottenPassword(
		id: string, 
		resetRidderPasswordDto: ResetRidderPasswordDto, 
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

			if (responseOfSelectingRidderAuth[0].authCode !== resetRidderPasswordDto.authCode) {
				throw ClientAuthCodeNotPairException;
			}
			if (responseOfSelectingRidderAuth[0].authCodeExpiredAt <= new Date()) {
				throw ClientAuthCodeExpiredException;
			}

			// reset logic
			const responseOfSelectingRidder = await tx.select({
				id: RidderTable.id,
				hash: RidderTable.password,
			  }).from(RidderTable)
				.where(eq(RidderTable.id, id))
				.limit(1);
			if (!responseOfSelectingRidder || responseOfSelectingRidder.length === 0) {
				throw ClientRidderNotFoundException;
			}

			const pwMatches = await bcrypt.compare(resetRidderPasswordDto.password, responseOfSelectingRidder[0].hash);
			if (pwMatches) throw ClientNoChangeOnPasswordException;

			const hash = await bcrypt.hash(resetRidderPasswordDto.password, Number(this.config.get("SALT_OR_ROUND")));
			return await tx.update(RidderTable).set({
				password: hash, 
			}).where(eq(RidderTable.id, id))
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
}

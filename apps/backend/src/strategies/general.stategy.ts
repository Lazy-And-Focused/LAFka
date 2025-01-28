import AuthUser from "database/classes/default/auth-user.class";
import User from "database/classes/default/user.class";
import Database from "database/database/models.database";

const { auth_users: AuthUsers } = Database;

import passport from "passport";
import Authenticator from "./authenticator";

class GeneralStrategy {
	protected readonly _passport: passport.PassportStatic = require("passport");
	private readonly _authenticator: Authenticator;

	public constructor() {
		this.serializer();

		this._authenticator = new Authenticator(this._passport);
	}

	public get auth(): Authenticator {
		return this._authenticator;
	}

	private serializer() {
		this._passport.serializeUser((user: any, done) => {
			return done(null, user);
		});

		this._passport.deserializeUser(async (u: any, done) => {
			try {
				const user = await AuthUsers.model.findOne({ service_id: u._service_id });

				return user ? done(null, user) : done(null, null);
			} catch (err) {
				console.error(err);

				return done(err, null);
			}
		});
	}

	public readonly initialize = () => {
		return this._passport.initialize();
	};

	public readonly session = () => {
		return this._passport.session();
	};

	public get passport() {
		return this._passport;
	}
}

export default GeneralStrategy;

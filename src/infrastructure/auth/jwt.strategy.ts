import { PassportStrategy } from "@nestjs/passport";

import { EnvService } from "../env/env.service";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JWTPayloadProps, JWTTokenProps } from "./current-user.dto";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private envService: EnvService) {
        super({
            secretOrKey: envService.get("JWT_SECRET"),
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
        });
    }

    validate(payload: JWTPayloadProps): JWTTokenProps {
        if (payload.type !== "access_token") throw new UnauthorizedException("Invalid token type");

        return { id: payload.sub, email: payload.email, roles: payload.roles };
    }
}

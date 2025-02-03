import { RoleEnum } from "./enums/role";
import { Role } from "./role";

describe("Role", () => {
    it("should create a role", () => {
        const role = Role.create({ name: RoleEnum.ASSOCIATED }, "role-id");

        expect(role).toBeInstanceOf(Role);
        expect(role.name).toBe(RoleEnum.ASSOCIATED);
        expect(role.id).toBe("role-id");
    });
});

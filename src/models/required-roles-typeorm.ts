import { Entity, PrimaryColumn } from "typeorm";

@Entity({ name: "required_roles" })
export class RequiredRolesTypeorm {
    @PrimaryColumn()
    guildId: string;

    @PrimaryColumn()
    cmdId: string;

    @PrimaryColumn()
    roleId: string;
}

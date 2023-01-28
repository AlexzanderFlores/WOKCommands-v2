import { Entity, PrimaryColumn } from "typeorm";

@Entity({ name: "required_permissions" })
export class RequiredPermissionsTypeorm {
    @PrimaryColumn()
    guildId: string;

    @PrimaryColumn()
    cmdId: string;

    @PrimaryColumn()
    permission: string;
}

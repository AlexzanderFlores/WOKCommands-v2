import {Column, DataSource, Entity, PrimaryColumn} from "typeorm";

@Entity({name: 'required_permissions'})
export class RequiredPermissionsTypeorm {
    @PrimaryColumn()
    guildId: string

    @PrimaryColumn()
    cmdId: string
    @Column()
    permission: string
}
import {Column, DataSource, Entity, PrimaryColumn} from "typeorm";

@Entity({name: 'required_roles'})
export class RequiredRolesTypeorm {
    @PrimaryColumn()
    guildId: string

    @Column()
    cmdId: string

    @Column()
    roleId: string
}
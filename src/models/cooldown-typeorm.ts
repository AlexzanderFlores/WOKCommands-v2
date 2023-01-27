import {Column, Entity, PrimaryColumn} from "typeorm";

@Entity({name: 'cooldown'})
export class CooldownTypeorm {
    @PrimaryColumn()
    guildId: string

    @Column()
    cmdId: string

    @Column()
    expires: Date
}
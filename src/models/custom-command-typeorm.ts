import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity({ name: "custom_command" })
export class CustomCommandTypeorm {
    @PrimaryColumn()
    guildId: string;

    @Column()
    cmdId: string;

    @Column()
    response: string;
}

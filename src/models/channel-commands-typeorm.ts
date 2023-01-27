import {Entity, PrimaryColumn} from "typeorm";

@Entity({name: 'channel_commands'})
export class ChannelCommandsTypeorm {
    @PrimaryColumn()
    guildId: string;

    @PrimaryColumn()
    commandId: string;


    @PrimaryColumn()
    channelId: string;
}
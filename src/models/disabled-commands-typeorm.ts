import {DataSource, Entity, PrimaryColumn} from "typeorm";
import {GuildPrefixTypeorm} from "./guild-prefix-typeorm";
import {ds} from "../WOK";

@Entity({name: 'disabled_command'})
export class DisabledCommandsTypeorm {
    @PrimaryColumn()
    guildId: string;
    @PrimaryColumn()
    cmdName: string;
}

export const findDisabledCommand = async (): Promise<DisabledCommandsTypeorm[]> => {
    const repo = await ds.getRepository(DisabledCommandsTypeorm);
    const result = await repo.find()
    return !result ? [] : result;
}

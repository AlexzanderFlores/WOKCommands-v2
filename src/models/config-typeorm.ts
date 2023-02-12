import { Column, Entity, PrimaryColumn } from "typeorm";
import { ds } from "../DCMD";
import ConfigType from "../util/ConfigType";

@Entity({ name: "configs" })
export class ConfigTypeorm {
    @PrimaryColumn({ unique: true })
    key: string;

    @Column("varchar", { nullable: true })
    value!: string | null;

    @Column("varchar", { nullable: true })
    description!: string | null;

    @Column({ nullable: false, default: false })
    isRequireForRun: boolean;

    public static async findByKey(
        key: ConfigType
    ): Promise<ConfigTypeorm | null> {
        return await ds.getRepository(ConfigTypeorm).findOneBy({ key: key });
    }
}

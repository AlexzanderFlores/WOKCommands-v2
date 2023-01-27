import {Column, Entity, PrimaryColumn} from "typeorm";

@Entity({name: 'configs'})
export class ConfigTypeorm {
    @PrimaryColumn({unique: true})
    key: string;

    @Column('varchar', {nullable: true})
    value!: string | null;

    @Column('varchar', {nullable: true})
    description!: string | null;

    @Column({nullable: false, default: false})
    isRequireForRun: boolean
}

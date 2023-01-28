import { ds } from "../../WOK";
import { ConfigTypeorm } from "../config-typeorm";
import ConfigType from "../../util/ConfigType";

export const migrateConfig = async () => {
    const repo = ds.getRepository(ConfigTypeorm);

    for (const config of Object.values(ConfigType)) {
        await repo.query(
            "INSERT IGNORE INTO `configs` (`key`, `isRequireForRun`) VALUES " +
                `('${config}', 0);`
        );
    }
};

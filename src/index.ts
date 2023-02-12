import WOK from "./DCMD";
import CommandType from "./util/CommandType";
import CooldownTypes from "./util/CooldownTypes";
import DefaultCommands from "./util/DefaultCommands";
import DbModels from "./models/index-model";
import ConfigType from "./util/ConfigType";

module.exports = WOK;
module.exports.CommandType = CommandType;
module.exports.ConfigType = ConfigType;
module.exports.CooldownTypes = CooldownTypes;
module.exports.DefaultCommands = DefaultCommands;
module.exports.DbModels = DbModels;

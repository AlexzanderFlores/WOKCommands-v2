"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChannelCommandsTypeorm = void 0;
const typeorm_1 = require("typeorm");
let ChannelCommandsTypeorm = class ChannelCommandsTypeorm {
    guildId;
    commandId;
    channelId;
};
__decorate([
    (0, typeorm_1.PrimaryColumn)(),
    __metadata("design:type", String)
], ChannelCommandsTypeorm.prototype, "guildId", void 0);
__decorate([
    (0, typeorm_1.PrimaryColumn)(),
    __metadata("design:type", String)
], ChannelCommandsTypeorm.prototype, "commandId", void 0);
__decorate([
    (0, typeorm_1.PrimaryColumn)(),
    __metadata("design:type", String)
], ChannelCommandsTypeorm.prototype, "channelId", void 0);
ChannelCommandsTypeorm = __decorate([
    (0, typeorm_1.Entity)({ name: 'channel_commands' })
], ChannelCommandsTypeorm);
exports.ChannelCommandsTypeorm = ChannelCommandsTypeorm;

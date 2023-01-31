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
exports.CommandLogTypeorm = void 0;
const typeorm_1 = require("typeorm");
let CommandLogTypeorm = class CommandLogTypeorm {
    guildId;
    commandId;
    userId;
    data;
    cmdType;
    triggeredAtCTS;
    triggeredAtUTS;
};
__decorate([
    (0, typeorm_1.PrimaryColumn)({ unique: true }),
    __metadata("design:type", String)
], CommandLogTypeorm.prototype, "guildId", void 0);
__decorate([
    (0, typeorm_1.PrimaryColumn)(),
    __metadata("design:type", String)
], CommandLogTypeorm.prototype, "commandId", void 0);
__decorate([
    (0, typeorm_1.PrimaryColumn)(),
    __metadata("design:type", String)
], CommandLogTypeorm.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)("varchar", { nullable: true }),
    __metadata("design:type", Object)
], CommandLogTypeorm.prototype, "data", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], CommandLogTypeorm.prototype, "cmdType", void 0);
__decorate([
    (0, typeorm_1.PrimaryColumn)(),
    __metadata("design:type", Date)
], CommandLogTypeorm.prototype, "triggeredAtCTS", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], CommandLogTypeorm.prototype, "triggeredAtUTS", void 0);
CommandLogTypeorm = __decorate([
    (0, typeorm_1.Entity)({ name: "command_logs" })
], CommandLogTypeorm);
exports.CommandLogTypeorm = CommandLogTypeorm;

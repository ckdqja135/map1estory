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
exports.RoleSchema = exports.RoleDefinition = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const role_enum_1 = require("../../common/enums/role.enum");
let RoleDefinition = class RoleDefinition {
    name;
    description;
    permissions;
};
exports.RoleDefinition = RoleDefinition;
__decorate([
    (0, mongoose_1.Prop)({ type: String, enum: role_enum_1.Role, required: true, unique: true }),
    __metadata("design:type", String)
], RoleDefinition.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], RoleDefinition.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String] }),
    __metadata("design:type", Array)
], RoleDefinition.prototype, "permissions", void 0);
exports.RoleDefinition = RoleDefinition = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], RoleDefinition);
exports.RoleSchema = mongoose_1.SchemaFactory.createForClass(RoleDefinition);
//# sourceMappingURL=role.schema.js.map
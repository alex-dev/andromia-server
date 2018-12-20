"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@tsed/core");
const common_1 = require("@tsed/common");
const mongoose_1 = require("mongoose");
const constants_1 = require("../constants");
const MONGOOSE_RESERVED_KEYS = ["_id"];
const clean = (src) => Object.keys(src).reduce((obj, k) => {
    if (src[k] !== undefined) {
        obj[k] = src[k];
    }
    return obj;
}, {});
function mapProps(jsonProps = {}) {
    const { minimum, maximum, minLength, maxLength } = jsonProps;
    let { pattern } = jsonProps;
    const enumProp = jsonProps["enum"];
    const defaultProp = jsonProps["default"];
    if (pattern) {
        pattern = new RegExp(pattern);
    }
    return clean({
        match: pattern,
        min: minimum,
        max: maximum,
        minlength: minLength,
        maxlength: maxLength,
        enum: enumProp,
        default: defaultProp
    });
}
exports.mapProps = mapProps;
/**
 *
 * @param target
 * @returns {"mongoose".SchemaDefinition}
 */
function buildMongooseSchema(target) {
    const properties = common_1.PropertyRegistry.getProperties(target);
    const jsonSchema = common_1.JsonSchemesRegistry.getSchemaDefinition(target) || {};
    const mSchema = {};
    if (properties) {
        properties.forEach((propertyMetadata, propertyKey) => {
            if (MONGOOSE_RESERVED_KEYS.indexOf(propertyKey) > -1) {
                return;
            }
            let definition = {
                required: propertyMetadata.required
                    ? function () {
                        return propertyMetadata.isRequired(this[propertyKey]);
                    }
                    : false
            };
            if (propertyMetadata.isClass) {
                definition = Object.assign(definition, {
                    type: mongoose_1.Schema.Types.ObjectId,
                    ref: core_1.Store.from(propertyMetadata.type).get(constants_1.MONGOOSE_MODEL_NAME)
                });
            }
            else {
                definition = Object.assign(definition, { type: propertyMetadata.type }, mapProps((jsonSchema.properties || {})[propertyKey]));
            }
            definition = clean(Object.assign(definition, propertyMetadata.store.get(constants_1.MONGOOSE_SCHEMA) || {}));
            mSchema[propertyKey] = propertyMetadata.isArray ? [definition] : definition;
        });
    }
    return mSchema;
}
exports.buildMongooseSchema = buildMongooseSchema;

//# sourceMappingURL=buildMongooseSchema.js.map

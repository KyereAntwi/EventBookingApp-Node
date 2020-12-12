const Joi = require('joi');

const registerValidation = (data) => {
    const validationSchema = Joi.object({
        name: Joi.string().min(6).max(50).required(),
        email: Joi.string().min(6).max(255).email().required(),
        password: Joi.string().min(8).required()
    })

    return validationSchema.validate(data);
}

const loginValidation = (data) => {
    const validationSchema = Joi.object(
        {
            email: Joi.string().min(6).max(255).email().required(),
            password: Joi.string().min(8).required()
        }
    )

    return validationSchema.validate(data);
}

const isFileImage = (file) => {
    const acceptedImageTypes = ['image/jpeg', 'image/png'];
    file.name = `${file.name}${new Date().toISOString()}.png`;
    return {
        isImage: file && acceptedImageTypes.includes(file['type']),
        name: file.name
    }
}

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
module.exports.isFileImage = isFileImage;
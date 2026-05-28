import crypto from 'crypto';

/*

    TIMESTAMP + RANDOMNESS
    
    TIMESTAMP ALLOWS SORTING OF FILES
    BASED ON THE ORDER IN WHICH THEY
    WERE GENERATED.

*/

export const generateFileId = () => {
    
    const timestamp = Date.now();

    const random = crypto.randomBytes(3).toString('hex');

    return `${timestamp}-${random}`;
    
};
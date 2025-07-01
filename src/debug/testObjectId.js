import { generateId, isValidObjectId } from '../utils/gameUtils';

/**
 * Test ObjectId generation and validation
 */
export const testObjectIdGeneration = () => {
    console.log('🧪 Testing ObjectId generation and validation...\n');

    // Test ID generation
    console.log('Generating 5 test ObjectIds:');
    for (let i = 0; i < 5; i++) {
        const id = generateId();
        const isValid = isValidObjectId(id);
        console.log(`${i + 1}. Generated: ${id}`);
        console.log(`   Length: ${id.length}, Valid: ${isValid ? '✅' : '❌'}\n`);
    }

    // Test validation with known formats
    console.log('Testing validation with different ID formats:');

    const testIds = [
        '507f1f77bcf86cd799439011', // Valid 24-char hex
        '507f1f77bcf86cd79943901',  // Invalid - 23 chars
        '507f1f77bcf86cd7994390111', // Invalid - 25 chars
        'invalid-id-format',         // Invalid - not hex
        '',                          // Invalid - empty
        '507F1F77BCF86CD799439011', // Valid - uppercase hex
        generateId(),                // Our generated ID
    ];

    testIds.forEach((id, index) => {
        const isValid = isValidObjectId(id);
        console.log(`${index + 1}. ID: "${id}"`);
        console.log(`   Length: ${id.length}, Valid: ${isValid ? '✅' : '❌'}\n`);
    });

    console.log('🧪 ObjectId testing completed!');
};

/**
 * Test the exact scenario that was failing
 */
export const testFailingScenario = async () => {
    console.log('🔍 Testing the exact failing scenario...\n');

    // Simulate old-style userId (what was causing the error)
    const oldStyleUserId = Date.now().toString(36) + Math.random().toString(36).substr(2);
    console.log('Old style userId:', oldStyleUserId);
    console.log('Is valid ObjectId:', isValidObjectId(oldStyleUserId) ? '✅' : '❌');

    // Generate new ObjectId format
    const newObjectId = generateId();
    console.log('New ObjectId format:', newObjectId);
    console.log('Is valid ObjectId:', isValidObjectId(newObjectId) ? '✅' : '❌');

    console.log('\n🔍 This should fix the BSON error!');
};

export default {
    testObjectIdGeneration,
    testFailingScenario,
};

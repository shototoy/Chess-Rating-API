const logAction = async (action, entityType = null, entityId = null, details = null) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ACTION: ${action} | ENTITY: ${entityType} (${entityId}) | DETAILS:`, details ? JSON.stringify(details) : 'None');
};
module.exports = { logAction };

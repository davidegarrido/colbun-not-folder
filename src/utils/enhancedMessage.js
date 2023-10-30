async function enhancedMessage(changesObject) {
    const filesAdded = changesObject.filesAdded || [];
    const filesRemoved = changesObject.filesRemoved || [];
    const filesModified = changesObject.filesModified || [];

    let message = "<b>Nuevos cambios:</b><br><br>";

    if (filesAdded.length > 0) {
        message += "<b>Cambios Agregados:</b><br><br>";

        for (const item of filesAdded) {
            message += `<b>Cambio: Agregado</b><br>`;
            message += `<b>Archivo</b>: ${item.name}<br>`;
            message += `<b>Fecha de Modificación</b>: ${item.dateModified}<br>`;
            message += `<b>Modificado por</b>: ${item.modifiedBy}<br>`;
            message += `<b>Tipo de Archivo</b>: ${item.fileType}<br>`;
            message += `<b>Carpeta</b>: ${item.path}<br><br>`;
        }
    }

    if (filesRemoved.length > 0) {
        message += "<b>Cambios Eliminados:</b><br><br>";

        for (const item of filesRemoved) {
            message += `<b>Cambio: Eliminado</b><br>`;
            message += `<b>Archivo</b>: ${item.name}<br>`;
            message += `<b>Fecha de Modificación</b>: ${item.dateModified}<br>`;
            message += `<b>Modificado por</b>: ${item.modifiedBy}<br>`;
            message += `<b>Tipo de Archivo</b>: ${item.fileType}<br>`;
            message += `<b>Carpeta</b>: ${item.path}<br><br>`;
        }
    }

    if (filesModified.length > 0) {
        message += "<b>Cambios Modificados:</b><br><br>";

        for (const item of filesModified) {
            message += `<b>Cambio: Modificado</b><br>`;
            message += `<b>Archivo</b>: ${item.name}<br>`;
            message += `<b>Fecha de Modificación</b>: ${item.dateModified}<br>`;
            message += `<b>Modificado por</b>: ${item.modifiedBy}<br>`;
            message += `<b>Tipo de Archivo</b>: ${item.fileType}<br>`;
            message += `<b>Carpeta</b>: ${item.path}<br><br>`;
        }
    }

    return message;
}

export { enhancedMessage };

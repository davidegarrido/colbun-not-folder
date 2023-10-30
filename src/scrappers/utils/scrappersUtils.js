async function getDataFromRows(page, rows, path) {
    const data = [];

    try {
        for (const row of rows) {
            const name = await page.evaluate(row => row.querySelector('.nameField_c45bee6b').textContent, row);
            const dateModified = await page.evaluate(row => row.querySelector('div[data-automation-key="dateModifiedColumn_708"]').textContent, row);
            const modifiedBy = await page.evaluate(row => row.querySelector('div[data-automation-key="modifiedByColumn_1240"]').textContent, row);
            const fileType = await name.includes('.') ? name.split('.').pop() : 'folder';

            if (fileType !== 'folder') {
                const rowData = {
                    name,
                    dateModified,
                    modifiedBy,
                    fileType,
                    path,
                };
                
                data.push(rowData);
            }

        }
    } catch (error) {
        console.error('Error in getDataFromRows:', error);
        // Handle the error as needed, e.g., return an empty array or rethrow the error.
    }

    return data;
}

async function clickFolderButtons(page, listOfElements, parentFolderName = "") {
    const allData = [];

    try {

            // const name = await page.evaluate(element => element.querySelector('.nameField_c45bee6b').textContent, element);
            const name = parentFolderName
            const fileType = await name.includes('.') ? name.split('.').pop() : 'folder';

            if (fileType === 'folder') {
                const buttonSelector = `button[title="${parentFolderName}"]`;
                const button = await page.$(buttonSelector);

                if (button) {
                    await button.click();
                    await page.waitForTimeout(200);
                    const subFolderName = parentFolderName ? parentFolderName + ' / ' + name : name;

                    const folderData = await getDataFromRows(page, await page.$$('div[role="grid"] .ms-DetailsList-contentWrapper .ms-DetailsRow'), subFolderName);

                    const subfolderData = await clickFolderButtons(page, await page.$$('div[role="grid"] .ms-DetailsList-contentWrapper .ms-DetailsRow'), subFolderName);

                    allData.push(...folderData, ...subfolderData);
                    await page.goBack();
                }
            }else{
                console.log("failed to get data");
            }
        }
    catch (error) {
        console.error('Error in clickFolderButtons:', error);
        // Handle the error as needed, e.g., return an empty array or rethrow the error.
    }

    return allData;
}



async function compareData(oldData, newData) {
    try {
        const filesAdded = [];
        const filesRemoved = [];
        const filesModified = [];

        const oldDataMap = new Map();

        oldData.forEach((oldObj) => {
            const key = getObjectKey(oldObj);
            oldDataMap.set(key, oldObj);
        });

        newData.forEach((newObj) => {
            const key = getObjectKey(newObj);

            if (!oldDataMap.has(key)) {
                filesAdded.push(newObj);
            } else {
                const oldObj = oldDataMap.get(key);

                if (!areObjectsEqual(oldObj, newObj)) {
                    filesModified.push({
                        oldObject: oldObj,
                        newObject: newObj
                    });
                }

                oldDataMap.delete(key);
            }
        });

        filesRemoved.push(...oldDataMap.values());

        if (filesAdded.length === 0 && filesRemoved.length === 0 && filesModified.length === 0) {
            return null;
        }

        return {
            filesAdded,
            filesRemoved,
            filesModified
        };
    } catch (error) {
        console.error('Error in compareData:', error);
    }
}

function getObjectKey(obj) {
    return `${obj.name}-${obj.dateModified}-${obj.modifiedBy}-${obj.fileType}-${obj.path}`;
}

function areObjectsEqual(obj1, obj2) {
    return (
        obj1.name === obj2.name &&
        obj1.dateModified === obj2.dateModified &&
        obj1.modifiedBy === obj2.modifiedBy &&
        obj1.fileType === obj2.fileType &&
        obj1.path === obj2.path
    );
}





export { getDataFromRows, clickFolderButtons, compareData };
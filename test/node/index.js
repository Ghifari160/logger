const Logger = require("../../lib/node");

let __casesQ = [];
let __casesSuccess = [];
let __casesFailed = [];

let __caseCurrent = null;

/**
 * Checks if a test case is in the queue
 *
 * @param {string} caseID Test case ID to check
 * @returns {boolean}
 */
function case_isEnqueued(caseID)
{
    let found = false;

    __casesQ.forEach((c) =>
    {
        if(c.id == caseID)
            found = true;
    });

    return found;
}

/**
 * Enqueues a test case
 *
 * @param {string} caseID Test case ID
 * @param {function} caseFn Test case function
 * @returns {boolean} Enqueueing status
 */
function case_enqueue(caseID, caseFn)
{
    if(case_isEnqueued(caseID))
    {
        console.log(`Case ${caseID} is already enqueued`);
        return false;
    }

    __casesQ.push({ id: caseID, fn: caseFn });

    return true;
}

/**
 * Dequeues a test case
 *
 * @param {string} caseID Test case ID
 * @returns Test case object
 */
function case_dequeue(caseID)
{
    let caseIndex = -1;

    for(i = 0; i < __casesQ.length; i++)
    {
        if(__casesQ[i].id == caseID)
            caseIndex = i;
    }

    if(caseIndex > -1)
    {
        let caseObj = __casesQ[caseIndex];

        __casesQ.splice(caseIndex, 1);

        return caseObj;
    }

    return false;
}

/**
 * Sets a test case's success state to success
 *
 * @param {string} caseID Test case ID
 */
function case_success(caseID)
{
    __casesSuccess.push(caseID);
    console.log("SUCCESS");
}

/**
 * Sets a test case's success state to failure
 *
 * @param {string} caseID Test case ID
 */
function case_fail(caseID)
{
    __casesFailed.push(caseID);
    console.log("FAILED");
}

/**
 * Executes a test case after dequeueing
 *
 * @param {(string|object)} caseID Test case ID or test case object
 * @returns {boolean} Test case success state
 */
function case_execute(caseID)
{
    let caseObj = {};

    if(typeof caseID === "object")
    {
        caseObj = caseID;
        caseID = caseObj.id;
    }
    else if(!case_isEnqueued(caseID))
    {
        console.log(`Case ${caseID} is not enqueued.`);
        return false;
    }

    caseObj = case_dequeue(caseID);

    __caseCurrent = caseObj.id;
    console.log(`Executing test case: ${caseObj.id}`);

    let caseStat = caseObj.fn();

    if(caseStat)
        case_success(caseObj.id);
    else if(typeof caseStat === "undefined")
        case_success(caseObj.id);
    else
        case_fail(caseObj.id);

    return true;
}

/**
 * Executes all test cases
 */
function cases_execute()
{
    console.log("Executing ALL test cases");

    while(__casesQ.length > 0)
    {
        case_execute(__casesQ[0].id);
    }

    console.log("Cases:");
    console.log(`  Executed: ${__casesSuccess.length + __casesFailed.length}  Success: ${__casesSuccess.length}  Failed: ${__casesFailed.length}`);
}

function logger_common(loggerInstance)
{
    loggerInstance.log(Logger.LOG_LEVEL.INFO, "This is an INFO entry");
    loggerInstance.log(Logger.LOG_LEVEL.WARN, "This is a WARN entry");
    loggerInstance.log(Logger.LOG_LEVEL.SEVERE, "This is a SEVERE entry");
    loggerInstance.log(Logger.LOG_LEVEL.FATAL, "This is a FATAL entry");

    loggerInstance.log(Logger.LOG_LEVEL.INFO, `This is a ${Logger.COLOR.UNDERSCORE}formatted${Logger.COLOR.RESET} INFO entry`);
    loggerInstance.log(Logger.LOG_LEVEL.WARN, `This is a ${Logger.COLOR.UNDERSCORE}formatted${Logger.COLOR.RESET} WARN entry`);
    loggerInstance.log(Logger.LOG_LEVEL.SEVERE, `This is a ${Logger.COLOR.UNDERSCORE}formatted${Logger.COLOR.RESET} SEVERE entry`);
    loggerInstance.log(Logger.LOG_LEVEL.FATAL, `This is a ${Logger.COLOR.UNDERSCORE}formatted${Logger.COLOR.RESET} FATAL entry`);

    loggerInstance.closeFiles();
}

case_enqueue("logger_AllDefined", () =>
{
    logger_common(new Logger(process.stdout, process.stderr, "outfile.log", "errfile.log"));
});

case_enqueue("logger_ImpliedErrFile", () =>
{
    logger_common(new Logger(process.stdout, process.stderr, "outfile.log"));
});

case_enqueue("logger_ImpliedFiles", () =>
{
    logger_common(new Logger(process.stdout, process.stderr));
});

case_enqueue("logger_ImpliedErrStream", () =>
{
    logger_common(new Logger(process.stdout));
});

case_enqueue("logger_ImpliedStreams", () =>
{
    logger_common(new Logger());
});

cases_execute();

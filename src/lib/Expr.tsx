import AuthenticationClient from "../clients/AuthenticationClient";

/**
 * Expression Class (Guard Pattern)
 */
class Expressions {

  waitRandom(ms: number) {
    const randomInt = Math.floor(Math.random() * ms) + 10
    return new Promise(res => setTimeout(res, randomInt));
  }

  /**
   * Execute a callback when the condition is True
   * @param {boolean} condition Expression to Check
   * @param {()=>void} callback Function to execute if the condition is True
   * @param {() => void} [falseCallback] Function to execute if the condition is False
   */
  whenTrue(condition: boolean, callback: () => void, falseCallback?: () => void) {
    if (condition) {
      callback();
    } else if (falseCallback) {
      falseCallback();
    }
  }

  /**
   * Execute a callback when the variable is not undefined
   * @param {boolean} variable Expression to Check
   * @param {()=>void} callback Function to execute if the condition is True
   */
  whenNotUndefined(variable: any, callback: () => void) {
    if (variable !== undefined) {
      callback();
    }
  }

  /**
   ** Execute a callback when the condition is False
   * @param {boolean} condition Expression to Check
   * @param {()=>void} callback Function to execute if the condition is False
   * @param {() => void} [trueCallback] Function to execute if the condition is True
   * @memberof Expressions
   */
  whenFalse(condition: boolean, callback: () => void, trueCallback?: () => void) {
    if (!condition) {
      callback();
    } else if (trueCallback) {
      trueCallback();
    }
  }


  /**
   * Function to execute if the system are in TEST_MODE ENV = true
   * @param {() => void} callback Function to execute if the condition is True
   * @memberof Expressions
   */
  whenTestMode(callback: () => void): any {
    if (process.env.REACT_APP_TEST_MODE === 'true') {
      return callback();
    }
  }

  /**
   * Function to execute if the user has the admin or developer role
   * @param {() => void} callback Function to execute if the condition is True
   * @returns {*} 
   * @memberof Expressions
   */
  whenHasElevatePrivileges(callback: () => void): any {
    const app_client_id = process.env.REACT_APP_ARCUS_WEB_CLIENT_ID;
    if (AuthenticationClient.isAuthenticated() && AuthenticationClient.hasRole([
      `${app_client_id}:owner`,
      `${app_client_id}:admin`,
      `${app_client_id}:developer`
    ])) {
      return callback();
    }
  }

}

export default new Expressions();
/*
 * See the NOTICE file distributed with this work for additional
 * information regarding copyright ownership.
 *
 * This is free software; you can redistribute it and/or modify it
 * under the terms of the GNU Lesser General Public License as
 * published by the Free Software Foundation; either version 2.1 of
 * the License, or (at your option) any later version.
 *
 * This software is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with this software; if not, write to the Free
 * Software Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA
 * 02110-1301 USA, or see the FSF site: http://www.fsf.org.
 *
 */

// #ifdef __TP_RPC_JSON
// #define __TP_RPC 1

/**
 * Implementation of the JSON-RPC protocol as a module for the RPC
 * plugin of apf.teleport. 
 * Example:
 * Ajax.org Markup Language
 * <code>
 *  <a:teleport>
 *      <a:rpc id="comm" protocol="jsonrpc">
 *          <a:method 
 *            name    = "searchProduct" 
 *            receive = "processSearch">
 *              <a:variable name="search" />
 *              <a:variable name="page" />
 *              <a:variable name="textbanner" value="1" />
 *          </a:method>
 *          <a:method 
 *            name = "loadProduct">
 *              <a:variable name="id" />
 *              <a:variable name="search_id" />
 *          </a:method>
 *      </a:rpc>
 *  </a:teleport>
 *
 *  <a:script>
 *      //This function is called when the search returns
 *      function processSearch(data, state, extra){
 *          alert(data)
 *      }
 *
 *      //Execute a search for the product car
 *      comm.searchProduct('car', 10);
 *  </a:script>
 * </code>
 *
 * @constructor
 *
 * @addenum rpc[@protocol]:jsonrpc
 *
 * @inherits apf.Class
 * @inherits apf.BaseComm
 * @inherits apf.http
 * @inherits apf.rpc
 *
 * @author      Ruben Daniels (ruben AT javeline DOT com)
 * @version     %I%, %G%
 * @since       0.4
 *
 * @default_private
 */
apf.jsonrpc = function(){
    this.supportMulticall = false;
    this.multicall        = false;
    
    this.method         = "POST";
    this.useXML           = false;
    this.id               = 0;
    this.namedArguments   = false;
    
    // Register Communication Module
    apf.teleport.register(this);
    
    
    // Stand Alone
    if (!this.uniqueId) {
        apf.makeClass(this);
        this.implement(apf.BaseComm, apf.http, apf.rpc);
    }
    
    this.getSingleCall = function(name, args, obj){
        obj.push({
            method: name,
            params: args
        });
    }
    
    // Create message to send
    this.serialize = function(functionName, args){
        this.fName = functionName;
        this.id++;
        
        //Construct the XML-RPC message
        var message = '{"method":"' + functionName + '","params":'
            + apf.serialize(args) + ',"id":' + this.id + '}';
        return message;
    }
    
    this.$HeaderHook = function(http){
        http.setRequestHeader('X-JSON-RPC', this.fName);
    }
    
    this.unserialize = function(str){
        var obj = eval('obj=' + str);
        return obj.result;
    }
}

// #endif
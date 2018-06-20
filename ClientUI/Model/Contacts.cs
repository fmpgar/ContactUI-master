using System;
using System.Collections.Generic;
using System.Runtime.CompilerServices;
using System.Linq;
using System.Threading.Tasks;
using Xrm.Sdk;

namespace ClientUI.Model
{
    public class Contact : Entity
    {
        public Contact()
            : base("contact")
        {
            this._metaData["creditlimit"] = AttributeTypes.Money;
        }

        

        #region fields
        [ScriptName("contactid")]
        public Guid ContactId;
        [ScriptName("parentcustomerid")]
        public EntityReference ParentCustomerId;
        [ScriptName("creditlimit")]
        public Money CreditLimit;
        [ScriptName("firstname")]
        public string FirstName;
        [ScriptName("lastname")]
        public string LastName;
        [ScriptName("preferredcontactmethodcode")]
        public int? PreferredContactMethodCode;

        #endregion
    }
}

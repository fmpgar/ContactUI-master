// ObservableContact.cs
//

using ClientUI.Model;
using ClientUI.View;
using KnockoutApi;
using SparkleXrm;
using SparkleXrm.GridEditor;
using System;
using System.Collections.Generic;
using System.Runtime.CompilerServices;
using Xrm;
using Xrm.Sdk;
using Xrm.Sdk.Messages;
using Xrm.Sdk.Metadata;
using Xrm.Sdk.Metadata.Query;

namespace ClientUI.ViewModel
{
    public class ObservableContact : ViewModelBase
    {

        public event Action<string> OnSaveComplete;

        
        #region Fields
        [PreserveCase]
        public Observable<bool> AddNewVisible = Knockout.Observable<bool>(false);
        [ScriptName("contactid")]
        public Observable<Guid> ContactId = Knockout.Observable<Guid>(); 
        [ScriptName("parentcustomerid")]
        public Observable<EntityReference> ParentCustomerId = Knockout.Observable<EntityReference>();
        [ScriptName("creditlimit")]
        public Observable<Money> CreditLimit = Knockout.Observable<Money>();
        [ScriptName("firstname")]
        public Observable<string> FirstName = Knockout.Observable<string>();
        [ScriptName("lastname")]
        public Observable<string> LastName = Knockout.Observable<string>();
        [ScriptName("preferredcontactmethodcode")]
        public Observable<int> PreferredContactMethodCode = Knockout.Observable<int>();
        #endregion

        public ObservableContact()
        {
            ObservableContact.RegisterValidation(new ObservableValidationBinder(this));
        }    
              
        //Validacion Apellido
        public static ValidationRules ValidateLastName(ValidationRules rules, object viewModel, object dataContext)
        {
            return rules
                .AddRequiredMsg(ResourceStrings.RequiredMessage);
        }


        public static void RegisterValidation(ValidationBinder binder)
        {
            binder.Register("lastname", ValidateLastName);
        }
        

        #region Commands
        //Comando cancelar
        [PreserveCase]
        public void CancelCommand()
        {
            this.AddNewVisible.SetValue(false);
        }
        //Comando salvar
        [PreserveCase]
        public void SaveCommand()
        {
            bool contactIsValid = ((IValidatedObservable)this).IsValid();
            if (!contactIsValid)
            {
                ((IValidatedObservable)this).Errors.ShowAllMessages(true);
                return;
            }

            IsBusy.SetValue(true);

            Contact contact = new Contact();

            string accountId = string.Empty; 
            if (ParentPage.Ui != null)
            {
                string guid = ParentPage.Data.Entity.GetId();
                if (guid != null)
                    accountId = guid.Replace("{", "").Replace("}", "");
            }


            //Asociamos los datos de la entidad contacto
            contact.ParentCustomerId = new EntityReference(new Guid(accountId), "account",null);
            contact.CreditLimit = CreditLimit.GetValue();
            contact.firstname = FirstName.GetValue();
            contact.LastName = LastName.GetValue();
            contact.PreferredContactMethodCode = PreferredContactMethodCode.GetValue();

            OrganizationServiceProxy.BeginCreate(contact, delegate(object state) {

                try
                {
                    ContactId.SetValue(OrganizationServiceProxy.EndCreate(state));
                    OnSaveComplete(null);
                    ((IValidatedObservable)this).Errors.ShowAllMessages(false);
                }
                catch(Exception ex)
                {
                    OnSaveComplete(ex.Message);
                }
                finally
                {
                    IsBusy.SetValue(false);
                    AddNewVisible.SetValue(false);
                }
            });
        }
        #endregion
    }
}

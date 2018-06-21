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
        [ScriptName("fullname")]
        public Observable<string> FullName = Knockout.Observable<string>();
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

            string accountId = string.Empty; //debug
            if (ParentPage.Ui != null)
            {
                string guid = ParentPage.Data.Entity.GetId();
                if (guid != null)
                    accountId = guid.Replace("{", "").Replace("}", "");
            }


            //contact.ParentCustomerId = ParentCustomerId.GetValue();
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

        //Abrir Grid Asociado
        [PreserveCase]
        public void OpenAssociatedSubGridCommand()
        { 
            //Test
            NavigationItem item = ParentPage.Ui.Navigation.Items.Get("navContacts");
            item.SetFocus();
        }

        public void contactSearchCommand(Guid account, Action<EntityCollection> callback)
        {
                  string contactFetchXml = String.Format(@"<fetch version='1.0' output-format='xml-platform' mapping='logical' distinct='false'>
                                          <entity name='contact'>
                                            <attribute name='fullname' />
                                            <attribute name='telephone1' />
                                            <attribute name='contactid' />
                                            <order attribute='fullname' descending='false' />
                                            <filter type='and'>
                                              <condition attribute='parentcustomerid' operator='eq' uiname='A. Datum' uitype='account' value='{0}' />
                                            </filter>
                                          </entity>
                                        </fetch>", Guid.Empty);

                  OrganizationServiceProxy.BeginRetrieveMultiple(contactFetchXml, delegate(object result) 
                  {
                      EntityCollection contactFetchResult = OrganizationServiceProxy.EndRetrieveMultiple(result, typeof(Entity));
                      callback(contactFetchResult);
                    
                  });



        }
        
        /*public Dictionary<int?, string> getPrimaryContactMethod(string attributeName, string entityName)
        {
          
            Dictionary<int?, string> result = new Dictionary<int?, string>();
            UserSettings userSettings = OrganizationServiceProxy.GetUserSettings();
            

            RetrieveAttributeRequest attributeRequest = new RetrieveAttributeRequest 
            {
                EntityLogicalName = entityName,
                LogicalName = attributeName,
                RetrieveAsIfPublished = true
            };

            // Get the response
            RetrieveAttributeResponse attributeResponse = (RetrieveAttributeResponse)OrganizationServiceProxy.Execute(attributeRequest);

            // Cast the response to attribute meta data
            AttributeMetadata attrMetadata = (AttributeMetadata)attributeResponse.AttributeMetadata;
            // Cast AttributeMetadata to StatusAttributeMetadata
            PicklistAttributeMetadata stateMetadata = (PicklistAttributeMetadata)attrMetadata;

            //Loop through each option and get value & label
            foreach (OptionMetadata optionMeta in stateMetadata.OptionSet.Options)
            {
                result.Add(optionMeta.Value, optionMeta.Label.UserLocalizedLabel.Label);
                //To get  the mapping  state code
                //int stateOptionValue = (int)((StatusOptionMetadata)optionMeta).State;
            }

            return result;
        }*/
        #endregion
    }
}

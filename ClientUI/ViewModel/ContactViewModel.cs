// HelloWorldViewModel.cs
//

using ClientUI.Model;
using KnockoutApi;
using Slick;
using SparkleXrm;
using SparkleXrm.GridEditor;
using System;
using System.Collections.Generic;
using System.Runtime.CompilerServices;
using Xrm;
using Xrm.Sdk;
using Xrm.Sdk.Metadata.Query;

namespace ClientUI.ViewModel
{
    // root view model
    public class ContactViewModel : ViewModelBase
    {
        public EntityDataViewModel Contacts;
       
        private int recordCount = 10;
        
        #region Fields
        [PreserveCase]
        public Observable<string> ErrorMessage;
        [PreserveCase]
        public Observable<ObservableContact> ContactEdit;
        [PreserveCase]
        public Observable<bool> AllowAddNew = Knockout.Observable<bool>(true);
        #endregion

        #region Constructors
        public ContactViewModel()
        {
            
            ObservableContact contact = new ObservableContact();
            Contacts = new EntityDataViewModel(15, typeof(Contact), false);
            ContactEdit = (Observable<ObservableContact>)ValidatedObservableFactory.ValidatedObservable(contact);//Knockout.Observable<ObservableContact>(new ObservableContact());
            ContactEdit.GetValue().OnSaveComplete += ContactViewModel_OnSaveComplete;
            ErrorMessage = Knockout.Observable<string>();
            Contacts.OnDataLoaded.Subscribe(Contacts_OnDataLoaded);

            ObservableContact.RegisterValidation(Contacts.ValidationBinder);
        }

        private void Contacts_OnDataLoaded(EventData e, object data)
        {
            DataLoadedNotifyEventArgs args = (DataLoadedNotifyEventArgs)data;

            for (int i = 0; i < args.To+1; i++)
            {
                Contact contact = (Contact)Contacts.GetItem(i);
                Utility.AlertDialog(String.Format("First Name is {0}, Last Name is {1}, Credit limit is {2}", contact.FirstName, contact.LastName, contact.CreditLimit), delegate() { });
                if (contact == null)
                    return;
                contact.PropertyChanged += contact_PropertyChanged;
                
            }
        }

        private string GetAccountId()
        {
            string accountId = "50A82980-9574-E811-811A-5065F38BA241"; //debug
            if (ParentPage.Ui != null)
            {
                string guid = ParentPage.Data.Entity.GetId();
                if (guid != null)
                    accountId = guid.Replace("{", "").Replace("}", "");
            }

            return accountId;
        }
        void contact_PropertyChanged(object sender, Xrm.ComponentModel.PropertyChangedEventArgs e)
        {
            Contact update = (Contact)sender;
            Utility.AlertDialog(String.Format("First Name is {0}, Last Name is {1}, Credit limit is {2}", update.FirstName, update.LastName, update.CreditLimit), delegate() { });

            OrganizationServiceProxy.BeginUpdate(update, delegate(object state)
            {
                try
                {
                    OrganizationServiceProxy.Update(update);
                    ErrorMessage.SetValue("");
                }
                catch(Exception ex)
                {
                    ErrorMessage.SetValue(ex.Message);
                }
                finally
                {
                }
            });
        }

        void ContactViewModel_OnSaveComplete(string result)
        {
            if (result == null)
            {
                ErrorMessage.SetValue(null);
                Contacts.Reset();
                Contacts.Refresh();
            }
            else
            {
                ErrorMessage.SetValue(result);
            }
        }
        #endregion

        

        #region Methods
        public void Search()
        {
           
            Contacts.FetchXml = @"<fetch version='1.0' output-format='xml-platform' mapping='logical'  returntotalrecordcount='true' no-lock='true' distinct='false' count='{0}' paging-cookie='{1}' page='{2}'>
                                            <entity name='contact'>
                                            <attribute name='firstname' />
                                            <attribute name='lastname' />
                                            <attribute name='preferredcontactmethodcode' />
                                            <attribute name='creditlimit' />                                            
                                            <attribute name='contactid' />
                                            <order attribute='fullname' descending='false' />
                                      <filter>
                                        <condition attribute='parentcustomerid' operator='eq' value='" + GetAccountId() + @"' />
                                       </filter>   
                                            {3}
                                            </entity>
                                        </fetch>";

            //Contacts.Refresh();
        }
        #endregion

        #region Commands
        [PreserveCase]
        public void AddNewCommand()
        {
            ContactEdit.GetValue().AddNewVisible.SetValue(true);
        }
        #endregion
    }
}

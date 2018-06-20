// Class1.cs
//

using ClientUI.ViewModel;
using jQueryApi;
using Slick;
using SparkleXrm;
using SparkleXrm.GridEditor;
using System;
using System.Collections.Generic;
using System.Runtime.CompilerServices;
using Xrm;
using Xrm.Sdk;
using System.Html;

namespace ClientUI.View
{

    public static class ContactView
    {
        public static ContactViewModel vm;
        public static Grid contactsGrid;
        public static UserSettings currentUserSettings;

        [PreserveCase]
        public static void Init()
        {

            vm = new ContactViewModel();

            List<Column> columns = new List<Column>();
            GridDataViewBinder.AddEditIndicatorColumn(columns);

            XrmTextEditor.BindColumn(
                          GridDataViewBinder.AddColumn(columns, "Nombre", 200, "firstname"));
            XrmTextEditor.BindColumn(
  GridDataViewBinder.AddColumn(columns, "Apellido", 200, "lastname"));

            XrmOptionSetEditor.BindColumn(
                GridDataViewBinder.AddColumn(columns, "Limite de credito", 200, "preferredcontactmethodcode"), "contact", "preferredcontactmethodcode", false);
            
            XrmMoneyEditor.BindColumn(
    GridDataViewBinder.AddColumn(columns, "Metodo de contacto", 200, "preferredcontactmethodcode"), -1000, 100000000);

            GridDataViewBinder contactGridDataBinder = new GridDataViewBinder();
            Grid contactsGrid = contactGridDataBinder.DataBindXrmGrid(vm.Contacts, columns, "container", "pager", true, true);
            contactGridDataBinder.BindCommitEdit(vm);

            ViewBase.RegisterViewModel(vm);
            Window.SetTimeout(delegate ()
            {
                vm.Search();
                vm.Contacts.Refresh();
            }, 0);


            //int lcid = OrganizationServiceProxy.GetUserSettings().UILanguageId.Value;
            /*LocalisedContentLoader.LoadContent("dev1_/js/Res.metadata.js", lcid, delegate() {
                ViewBase.RegisterViewModel(vm);*/

        }
    }
}

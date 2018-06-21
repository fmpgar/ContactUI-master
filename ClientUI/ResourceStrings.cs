// ResourceStrings.cs
//

using System;
using System.Collections.Generic;
using System.Runtime.CompilerServices;
using Xrm.Sdk;

namespace ClientUI
{
    [IgnoreNamespace]
    public class ResourceStrings
    {
        [PreserveCase]
        public static string RequiredMessage = OrganizationServiceProxy.GetUserSettings().UILanguageId.Value == 3082 ? "Requerido" : "Required";
        [PreserveCase]
        public static string SaveButton = OrganizationServiceProxy.GetUserSettings().UILanguageId.Value == 3082 ? "Guardar" : "Save";
        [PreserveCase]
        public static string CancelButton = OrganizationServiceProxy.GetUserSettings().UILanguageId.Value == 3082 ? "Cancelar" : "Cancel";

        [PreserveCase]
        public static string Contacts = OrganizationServiceProxy.GetUserSettings().UILanguageId.Value == 3082 ? "Contacto" : "Contacts";
        [PreserveCase]
        public static string FirstName = OrganizationServiceProxy.GetUserSettings().UILanguageId.Value == 3082 ? "Nombre" : "First Name";
        [PreserveCase]
        public static string LastName = OrganizationServiceProxy.GetUserSettings().UILanguageId.Value == 3082 ? "Apellido" : "Last Name";
        [PreserveCase]
        public static string CreditLimit = OrganizationServiceProxy.GetUserSettings().UILanguageId.Value == 3082 ? "Limite de credito" : "Credit Limit";
        [PreserveCase]
        public static string PreferredContactType = OrganizationServiceProxy.GetUserSettings().UILanguageId.Value == 3082 ? "Metodo de contacto" : "Preferred Contact Method";

    }
}

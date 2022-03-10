using System;
using System.Collections.Generic;
using SignalRTest2.Models;

namespace SignalRTest2.Services
{
    public static class DataManager
    {
        public static List<ChartModel> GetData()
        {
            var r = new Random();
            return new List<ChartModel>()
            {
                new ChartModel { Data = new List<int> { r.Next(1, 40) }, Label = "Data1" },          
                new ChartModel { Data = new List<int> { r.Next(1, 40) }, Label = "Data2" },
                new ChartModel { Data = new List<int> { r.Next(1, 40) }, Label = "Data3" }, 
                new ChartModel { Data = new List<int> { r.Next(1, 40) }, Label = "Data4" }
            };
        }
    }
}
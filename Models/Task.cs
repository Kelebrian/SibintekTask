using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SibintekTask.Models
{
    /// <summary>
    /// Класс Task.
    /// Представляет собой задачу.
    /// </summary>
    public class Task
    {
        /// <summary>
        /// Свойство. Представляет собой номер задачи.
        /// </summary>
        public int TaskId { get; set; }

        /// <summary>
        /// Свойство. Представляет собой описание задачи. 
        /// </summary>
        public string Description { get; set; }
       
        /// <summary>
        /// Свойство. Хранит статус завершения задачи.
        /// </summary>
        public bool Complete { get; set; }
    }
}
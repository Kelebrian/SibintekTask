using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using SibintekTask.Models;
using System.Data.SqlClient;
using System.Data;

namespace SibintekTask.Controllers
{
    /// <summary>
    /// Класс DBController.
    /// Предоставляет доступ к базе данных.
    /// Содержит методы манипуляции данными в БД.
    /// </summary>
    public class DBController : Controller
    {
        private const string connectionString =
            "workstation id=sibintekDB.mssql.somee.com;packet size=4096;user id=TaniaKelebrian_SQLLogin_1;pwd=eb3druju7x;data source=sibintekDB.mssql.somee.com;persist security info=False;initial catalog=sibintekDB";


        /// <summary>
        /// Получает список сохраненных задач.
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public ActionResult GetTasks()
        {
            string query = "select * from task;";
            SqlConnection connection = new SqlConnection(connectionString);
            connection.Open();
            SqlCommand command = new SqlCommand(query, connection);
            SqlDataReader sdr = command.ExecuteReader(CommandBehavior.CloseConnection);
            List<Task> tasks = new List<Task>();
            while (sdr.Read())
            {
                tasks.Add(new Task
                {
                    TaskId = sdr.GetInt32(0),
                    Description = sdr.GetString(1),
                    Complete = sdr.GetBoolean(2)
                });
            }
            connection.Close();
            return Json(tasks, JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// Добавляет запись в БД.
        /// </summary>
        /// <param name="task"></param>
        [HttpGet]
        public void CreateTask(int taskId, string task)
        {
            string query = "insert into task values (" + taskId +
                ",N'" + task + "', '" + false + "')";
            SqlConnection connection = new SqlConnection(connectionString);
            connection.Open();
            SqlCommand command = new SqlCommand(query, connection);
            command.ExecuteNonQuery();
            connection.Close();
        }

        /// <summary>
        /// Обновляет описание задачи.
        /// </summary>
        /// <param name="taskId"></param>
        /// <param name="task"></param>
        [HttpGet]
        public void UpdateTaskDescription(int taskId, string task)
        {
            string query = "update task set description = N'" + task +
                "' where taskid = " + taskId;
            SqlConnection connection = new SqlConnection(connectionString);
            connection.Open();
            SqlCommand command = new SqlCommand(query, connection);
            command.ExecuteNonQuery();
            connection.Close();
        }

        /// <summary>
        /// Обновляет статус задачи.
        /// </summary>
        /// <param name="taskId"></param>
        /// <param name="complete"></param>
        [HttpGet]
        public void UpdateTaskStatus(int taskId, bool complete)
        {
            string query = "update task set complete = '" + complete +
                "' where taskid = " + taskId;
            SqlConnection connection = new SqlConnection(connectionString);
            connection.Open();
            SqlCommand command = new SqlCommand(query, connection);
            command.ExecuteNonQuery();
            connection.Close();
        }


        [HttpGet]
        /// <summary>
        /// Получает максимальный идентификатор задания.
        /// </summary>
        /// <returns></returns>
        public int GetMaxId()
        {
            string query = "select max(taskid) from task;";
            SqlConnection connection = new SqlConnection(connectionString);
            connection.Open();
            SqlCommand command = new SqlCommand(query, connection);
            SqlDataReader sdr = command.ExecuteReader(CommandBehavior.CloseConnection);
            List<Task> tasks = new List<Task>();
            int max;
            if (sdr.Read()) max = sdr.GetInt32(0);
            else max = 0;
            connection.Close();
            return max;
        }

        /// <summary>
        /// Удалаяет выбранную задачу из БД.
        /// </summary>
        /// <param name="taskId"></param>
        [HttpGet]
        public void DeleteTask(int taskId)
        {
            string query = "delete from task where taskid = " + taskId;
            SqlConnection connection = new SqlConnection(connectionString);
            connection.Open();
            SqlCommand command = new SqlCommand(query, connection);
            command.ExecuteNonQuery();
            connection.Close();
        }

        /// <summary>
        /// Удаляет все задачи из БД.
        /// </summary>
        [HttpGet]
        public void DeleteAll()
        {
            string query = "delete from task";
            SqlConnection connection = new SqlConnection(connectionString);
            connection.Open();
            SqlCommand command = new SqlCommand(query, connection);
            command.ExecuteNonQuery();
            connection.Close();
        }
    }
}
class Admin::TasksController < ApplicationController
  before_action :set_tasks, only: %i[index]
  before_action :set_task, only: %i[show destroy clear_outputs set_demo_task]

  def index
  end

  def new
  end

  def show
    @log = query_app_task_pure
  end

  def set_demo_task
    @task.is_demo = !@task.is_demo
    @task.save!
    flash[:success] = "Task #{@task.is_demo ? "set to demo" : "reset" } successfully."
    redirect_to admin_task_path(@task)
  end

  def clear_outputs
    flash[:success] = 'Task outputs cleared.'
    @task.task_outputs.each do |topt|
      topt.destroy
    end
  end

  def destroy
    @task.destroy
    flash[:success] = 'Task deleted.'
    redirect_to admin_tasks_path
  end

  private

  def set_tasks
    @tasks = Task.all
    @task_columns = ["id", "status", "user_id","is_demo", "created_at"]
  end

  def set_task
    @task = Task.find params[:id]
  end

  def query_app_task_pure
    result_json = {
      code: false,
      data: ''
    }
    begin
      # query task
      client = LocalApi::Client.new
      result = ''
      if !@task.analysis.blank?
        result = client.task_info(45, @task.tid, 'app')
      else
        result = client.task_info(45, @task.tid, 'pipeline')
      end
      if !result['message']['status'].blank?
        result_json[:code] = true
        result_json[:data] = result
      else
        result_json[:data] = result
      end
    rescue StandardError => e
      result_json[:code] = false
      result_json[:data] = e.message
    end
    return result_json.to_json
  end
end

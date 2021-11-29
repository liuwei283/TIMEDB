class Admin::TasksController < ApplicationController
  before_action :set_tasks, only: %i[index]
  before_action :set_task, only: %i[show destroy]

  def index
    # @tasks = Task.all
  end

  def new
    # @tasks = BackgroundPipeline.all
  end

  def show
    @log = query_app_task_pure
    # @outputs = @task.task_outputs
    # @task.task_outputs.each do |topt|
    #   Rails.logger.debug "===>#{topt.analysis.name}"
    # end
  end

  def destroy
    @task.destroy
    flash[:success] = 'Task deleted.'
    redirect_to admin_tasks_path
  end

  private

  def set_tasks
    @tasks = Task.all
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
        result = client.task_info(@task.user.id, @task.tid, 'app')
      else
        result = client.task_info(@task.user.id, @task.tid, 'pipeline')
      end
      if !result['message']['status'].blank?
        result_json[:code] = true
        result_json[:data] = result
      else
        result_json[:data] = "deepomics error: " + result
      end
    rescue StandardError => e
      result_json[:code] = false
      result_json[:data] = e.message
    end
    return result_json.to_json
  end
end

class AddTaskOutputsToAnalysisKey < ActiveRecord::Migration[6.0]
  def change
    add_belongs_to :analysis_user_data, :task_output, foreign_key: true
    add_belongs_to :task_outputs, :analysis, foreign_key: true
  end
end

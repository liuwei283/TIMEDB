class RemoveTaskOutputUniqueKey < ActiveRecord::Migration[6.0]
  def change
    remove_index :task_outputs, :output_id
    add_index :task_outputs, :output_id
  end
end

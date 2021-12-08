class AddTaskDemoCheck < ActiveRecord::Migration[6.0]
  def change
    add_column :tasks, :is_demo, :boolean, :default => false
  end
end

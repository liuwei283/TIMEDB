class AddRunIdToTasks < ActiveRecord::Migration[6.0]
  def change
    add_column :tasks, :run_id, :int, :default=> -1
  end
end

class RemoveTaskOutputFromAnallysesUserData < ActiveRecord::Migration[6.0]
  def change
    change_table :analysis_user_data do |t|
      t.remove :task_output_id
    end
  end
end

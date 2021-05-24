class CreateTaskMaps < ActiveRecord::Migration[6.0]
  def change
    create_table :task_maps do |t|
      t.belongs_to :analysis, index: true
      t.belongs_to :analysis_pipeline, index: true
      t.belongs_to :task, index: true
    end
  end
end

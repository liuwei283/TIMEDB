class CreateAnalyses < ActiveRecord::Migration[6.0]
  def change
    create_table :analyses do |t|
      t.string :name, null:false
      t.json :files_info
      t.belongs_to :analysis_category
      t.belongs_to :visualizer
    end
  end
end

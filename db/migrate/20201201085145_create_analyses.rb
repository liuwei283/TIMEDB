class CreateAnalyses < ActiveRecord::Migration[6.0]
  def change
    create_table :analyses do |t|
      t.string :name, null:false
      t.string :visualizer, null:false
      t.string :js_module_name, null:false
      t.text :desc
      t.json :demo_files
      t.belongs_to :analysis_category
    end
  end
end

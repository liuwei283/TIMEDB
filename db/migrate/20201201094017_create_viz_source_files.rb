class CreateVizSourceFiles < ActiveRecord::Migration[6.0]
  def change
    create_table :viz_source_files do |t|
      t.string :name, null:false
      t.text :desc
      t.string :output_file_name, null:false
      t.string :data_type, null:false
      t.boolean :allow_multiple
      t.boolean :optional
      t.belongs_to :analysis
    end
  end
end

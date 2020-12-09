class CreateVizDataObjects < ActiveRecord::Migration[6.0]
  def change
    create_table :viz_data_objects do |t|
      t.belongs_to :viz_source_file
      t.belongs_to :visitor
      t.string :file_name, null:false
      t.text :file, null:false
      t.timestamps
    end
  end
end

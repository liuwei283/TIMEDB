class CreateAnalysisUserData < ActiveRecord::Migration[6.0]
  def change
    create_table :analysis_user_data do |t|
      t.belongs_to :visitor
      t.belongs_to :analysis
      t.text :chosen
      t.boolean :use_demo_file
      t.timestamps
    end
  end
end

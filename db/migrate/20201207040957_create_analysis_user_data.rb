class CreateAnalysisUserData < ActiveRecord::Migration[6.0]
  def change
    create_table :analysis_user_data do |t|
      t.belongs_to :visitor
      t.belongs_to :analysis
      t.json :chosen, null:false
      t.boolean :use_demo_file, default:true
    end
  end
end

class AddDemoIdToAnalysesPipelines < ActiveRecord::Migration[6.0]
  def change
    add_column :analyses, :single_demo_id, :int, :default=> -1
    add_column :analyses, :multiple_demo_id, :int, :default=> -1
    add_column :analysis_pipelines, :single_demo_id, :int, :default=> -1
    add_column :analysis_pipelines, :multiple_demo_id, :int, :default=> -1
  end
end
